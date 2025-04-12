
<?php
// Start session to maintain state
session_start();

// Set default location if not set
if(!isset($_SESSION['selectedLocation'])) {
    $_SESSION['selectedLocation'] = 'São Paulo';
}

// Handle location change if submitted
if(isset($_POST['location'])) {
    $_SESSION['selectedLocation'] = $_POST['location'];
}

// Get current date and time
$currentDate = new DateTime();
$formattedDate = $currentDate->format('d/m/Y');
$formattedTime = $currentDate->format('H:i');
$dayOfWeek = $currentDate->format('w'); // 0 (Sunday) to 6 (Saturday)

// Calculate start and end of current week for birthdays
$weekStart = clone $currentDate;
$weekStart->modify('-' . $dayOfWeek . ' days'); // Go back to Sunday
$weekEnd = clone $weekStart;
$weekEnd->modify('+6 days'); // Go forward to Saturday

// Format for display
$weekStartFormatted = $weekStart->format('d/m');
$weekEndFormatted = $weekEnd->format('d/m');

// Database connection function
function connectDB() {
    $host = 'localhost';
    $dbname = 'portal';
    $username = 'root';
    $password = '';
    
    try {
        $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch(PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}

// Get meetings for today
function getMeetings($location) {
    try {
        $conn = connectDB();
        $stmt = $conn->prepare("
            SELECT 
                id,
                requester,
                room,
                subject,
                date_start,
                date_end
            FROM meetings
            WHERE location = :location
            AND DATE(date_start) = CURDATE()
            ORDER BY date_start ASC
        ");
        
        $stmt->bindParam(':location', $location);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
        return [];
    }
}

// Get birthdays for current week
function getBirthdays($location, $weekStart, $weekEnd) {
    try {
        $conn = connectDB();
        
        // Format dates for MySQL query (MM-DD format)
        $weekStartFormatted = $weekStart->format('m-d');
        $weekEndFormatted = $weekEnd->format('m-d');
        
        $stmt = $conn->prepare("
            SELECT 
                nm_dsc_usu as name, 
                nm_dep as department, 
                DATE_FORMAT(dt_nac, '%d-%m') AS date 
            FROM LOGIN_USUARIO
            WHERE nm_cid = :location
            AND DATE_FORMAT(dt_nac, '%m-%d') BETWEEN :weekStart AND :weekEnd 
            ORDER BY DATE_FORMAT(dt_nac, '%m-%d')
        ");
        
        $stmt->bindParam(':location', $location);
        $stmt->bindParam(':weekStart', $weekStartFormatted);
        $stmt->bindParam(':weekEnd', $weekEndFormatted);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
        return [];
    }
}

// Get rooms
function getRooms() {
    return [
        'Sala Executiva 01',
        'Sala Executiva 02',
        'Sala de Reuniões 01',
        'Sala de Reuniões 02',
        'Auditório'
    ];
}

// Get locations
function getLocations() {
    return [
        'São Paulo',
        'Rio de Janeiro',
        'Belo Horizonte',
        'Brasília',
        'Curitiba'
    ];
}

// Get meetings for the current day
$meetings = getMeetings($_SESSION['selectedLocation']);

// Get birthdays for the current week
$birthdays = getBirthdays($_SESSION['selectedLocation'], $weekStart, $weekEnd);

// Get rooms and locations
$rooms = getRooms();
$locations = getLocations();

// Function to determine if a meeting is active, past or upcoming
function getMeetingStatus($startTime, $endTime) {
    $now = time();
    $start = strtotime($startTime);
    $end = strtotime($endTime);
    
    if ($now >= $start && $now <= $end) {
        return 'active';
    } elseif ($now > $end) {
        return 'past';
    } else {
        return 'upcoming';
    }
}

// Function to format time from datetime
function formatMeetingTime($datetime) {
    return date('H:i', strtotime($datetime));
}

?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Agendamento</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="header-left">
                    <img src="https://via.placeholder.com/120x40?text=Mondial" alt="Logo Mondial" class="logo">
                    <div class="divider"></div>
                    <h1 class="header-title">Sistema de Agendamento</h1>
                </div>
                <div class="header-right">
                    <div class="location-info">
                        <span class="location-label">Unidade</span>
                        <span class="location-value"><?php echo $_SESSION['selectedLocation']; ?></span>
                    </div>
                    <div class="divider"></div>
                    <div class="time"><?php echo $formattedTime; ?></div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main">
        <div class="container">
            <!-- Sidebar and Main Content Grid -->
            <div class="content-grid">
                <!-- Sidebar -->
                <aside class="sidebar">
                    <!-- Location Selector -->
                    <div class="sidebar-section">
                        <h2 class="sidebar-title">Selecionar Unidade</h2>
                        <form method="POST" action="">
                            <select name="location" id="location" onchange="this.form.submit()" class="select-field">
                                <?php foreach ($locations as $location): ?>
                                <option value="<?php echo $location; ?>" <?php if($_SESSION['selectedLocation'] == $location) echo 'selected'; ?>>
                                    <?php echo $location; ?>
                                </option>
                                <?php endforeach; ?>
                            </select>
                        </form>
                    </div>

                    <!-- Room Selector -->
                    <div class="sidebar-section">
                        <h2 class="sidebar-title">Salas Disponíveis</h2>
                        <div class="room-list">
                            <?php foreach ($rooms as $room): ?>
                            <div class="room-item">
                                <i class="fas fa-door-open"></i>
                                <span><?php echo $room; ?></span>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <!-- Birthdays Section -->
                    <div class="sidebar-section">
                        <h2 class="sidebar-title">Aniversariantes da Semana</h2>
                        <div class="date-range">
                            <?php echo $weekStartFormatted; ?> - <?php echo $weekEndFormatted; ?>
                        </div>
                        <div class="birthday-list">
                            <?php if (count($birthdays) > 0): ?>
                                <?php foreach ($birthdays as $birthday): ?>
                                <div class="birthday-item">
                                    <div class="birthday-icon">
                                        <i class="fas fa-gift"></i>
                                    </div>
                                    <div class="birthday-details">
                                        <div class="birthday-name"><?php echo $birthday['name']; ?></div>
                                        <div class="birthday-info">
                                            <span class="birthday-dept"><?php echo $birthday['department']; ?></span>
                                            <span class="birthday-date"><?php echo $birthday['date']; ?></span>
                                        </div>
                                    </div>
                                </div>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <p class="no-birthdays">Nenhum aniversariante esta semana</p>
                            <?php endif; ?>
                        </div>
                    </div>
                </aside>

                <!-- Main Content -->
                <div class="main-content">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Agenda de Reuniões - <?php echo $formattedDate; ?></h2>
                        </div>
                        <div class="card-body">
                            <!-- Meeting Schedule -->
                            <div class="meeting-schedule">
                                <?php if (count($meetings) > 0): ?>
                                    <?php foreach ($meetings as $meeting): ?>
                                        <?php 
                                            $status = getMeetingStatus($meeting['date_start'], $meeting['date_end']);
                                            $startTime = formatMeetingTime($meeting['date_start']);
                                            $endTime = formatMeetingTime($meeting['date_end']);
                                        ?>
                                        <div class="meeting-card meeting-<?php echo $status; ?>">
                                            <div class="meeting-time">
                                                <?php echo $startTime; ?> - <?php echo $endTime; ?>
                                            </div>
                                            <div class="meeting-details">
                                                <div class="meeting-subject"><?php echo $meeting['subject']; ?></div>
                                                <div class="meeting-room"><?php echo $meeting['room']; ?></div>
                                                <div class="meeting-requester">Requisitante: <?php echo $meeting['requester']; ?></div>
                                            </div>
                                            <div class="meeting-status">
                                                <?php if ($status === 'active'): ?>
                                                    <span class="status-badge status-active">Em Andamento</span>
                                                <?php elseif ($status === 'upcoming'): ?>
                                                    <span class="status-badge status-upcoming">Agendado</span>
                                                <?php else: ?>
                                                    <span class="status-badge status-past">Finalizado</span>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <div class="no-meetings">
                                        <p>Nenhuma reunião agendada para hoje</p>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> Mondial. Todos os direitos reservados.</p>
        </div>
    </footer>

    <!-- JavaScript -->
    <script src="js/scripts.js"></script>
</body>
</html>
