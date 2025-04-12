
// JavaScript for Sistema de Agendamento

document.addEventListener('DOMContentLoaded', function() {
    // Update time every second
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        document.querySelector('.time').textContent = timeString;
    }
    
    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
    
    // Add shadow to header on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 10) {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
    
    // Room item click functionality
    const roomItems = document.querySelectorAll('.room-item');
    roomItems.forEach(function(room) {
        room.addEventListener('click', function() {
            alert('Funcionalidade de visualização de sala a ser implementada');
        });
    });
});
