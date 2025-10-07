// Carregar tema salvo e data mínima
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = savedTheme;
    updateThemeIcon();
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = today;
    } else {
        console.error('Elemento com ID "date" não encontrado.');
    }
    showPage();
});

// Alternar tema
function toggleTheme() {
    const theme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    updateThemeIcon();
    showNotification(`Tema alterado para ${theme === 'light' ? 'Claro' : 'Escuro'}`);
}

// Atualizar ícone do tema
function updateThemeIcon() {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.textContent = document.body.dataset.theme === 'light' ? 'dark_mode' : 'light_mode';
    } else {
        console.error('Elemento com ID "themeIcon" não encontrado.');
    }
}

// Mostrar notificação (sem alterar title)
function showNotification(message) {
    const toastElement = document.getElementById('notificationToast');
    if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        document.querySelector('#notificationToast .toast-body').textContent = message;
        toast.show();
        const audio = document.getElementById('notificationSound');
        if (audio) audio.play();
    } else {
        console.error('Elemento com ID "notificationToast" não encontrado.');
    }
}

// Resetar contador de notificações ao focar a janela (removido update de title)
window.addEventListener('focus', () => {
    // Removido document.title update
});

// Agendamento
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async e => {
        e.preventDefault();
        const form = e.target;
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            showNotification('Por favor, preencha todos os campos corretamente.');
            return;
        }
        const name = document.getElementById('name').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const reason = document.getElementById('reason').value;
        try {
            const response = await fetch('http://localhost:3000/agendamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, whatsapp, service, date, reason })
            });
            const result = await response.json();
            if (response.ok) {
                showNotification('Agendamento enviado com sucesso!');
                bootstrap.Modal.getInstance(document.getElementById('appointmentModal')).hide();
                form.classList.remove('was-validated');
                form.reset();
            } else {
                showNotification(result.error);
            }
        } catch (error) {
            showNotification('Erro ao enviar agendamento');
            console.error('Erro na requisição:', error);
        }
    });
} else {
    console.error('Elemento com ID "appointmentForm" não encontrado.');
}

// Contato via WhatsApp
const whatsappForm = document.getElementById('whatsappForm');
if (whatsappForm) {
    whatsappForm.addEventListener('submit', async e => {
        e.preventDefault();
        const form = e.target;
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            showNotification('Por favor, preencha todos os campos corretamente.');
            return;
        }
        const name = document.getElementById('contactName').value;
        const whatsapp = document.getElementById('contactWhatsapp').value;
        const message = document.getElementById('contactMessage').value;
        const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(`Mensagem de ${name} (${whatsapp}): ${message}`)}`;
        window.open(whatsappUrl, '_blank');
        showNotification('Mensagem enviada com sucesso!');
        bootstrap.Modal.getInstance(document.getElementById('whatsappModal')).hide();
        form.classList.remove('was-validated');
        form.reset();
    });
} else {
    console.error('Elemento com ID "whatsappForm" não encontrado.');
}