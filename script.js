// Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // Variable para rastrear el estado de asistencia del usuario
    let attendanceState = 'OUT';

    // --- MANEJO DE SECCIONES (PANTALLAS) ---

    function showPageSection(sectionId) {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) {
            sectionToShow.classList.add('active');
        }
    }

    // --- NAVEGACIÓN INICIAL (Login y Recuperar) ---

    document.getElementById('show-recover').addEventListener('click', (e) => {
        e.preventDefault();
        showPageSection('section-recover');
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        showPageSection('section-login');
    });

    // --- LÓGICA DE LOGIN (US-41) ---
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        
        // MOSTRAR/OCULTAR BOTONES DE ADMIN
        if (username.toLowerCase() === 'rrhh') {
            document.querySelectorAll('.rrhh-only').forEach(btn => {
                btn.style.display = 'block'; // 'block' para sidebar
            });
            document.querySelectorAll('.sidebar-divider.rrhh-only').forEach(div => {
                div.style.display = 'block';
            });
            
            // Aterrizar en el Dashboard Global
            showAppContent('section-dashboard-global');
            setActiveButton('section-dashboard-global'); // Marcar botón activo
        } else {
            document.querySelectorAll('.rrhh-only').forEach(btn => {
                btn.style.display = 'none';
            });
            document.querySelectorAll('.sidebar-divider.rrhh-only').forEach(div => {
                div.style.display = 'none';
            });
            
            // Aterrizar en la bienvenida normal
            showAppContent('content-default');
            setActiveButton('content-default'); // Marcar botón activo
        }
        
        showPageSection('section-app'); // Mostrar la app principal
    });

    document.getElementById('recover-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Simulación: Si el correo existe, se ha enviado un enlace de recuperación.');
        showPageSection('section-login');
    });


    // --- NAVEGACIÓN DENTRO DE LA APP ---

    const appContentContainer = document.getElementById('app-content');
    const sidebar = document.getElementById('app-sidebar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');

    // --- NUEVO: Lógica del Menú Hamburguesa (OT-60) ---
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    /**
     * Actualiza el indicador visual en el panel lateral.
     */
    function setActiveButton(targetId) {
        // Quitar 'active' de todos los botones del sidebar
        document.querySelectorAll('.app-sidebar .nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        if (!targetId || targetId === 'content-default') {
            return;
        }

        // Añadir 'active' solo al botón correspondiente
        const activeButton = document.querySelector(`.app-sidebar .nav-btn[data-target="${targetId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    /**
     * Muestra el contenido de la plantilla y asigna eventos.
     */
    function showAppContent(contentId) {
        let template = document.getElementById(contentId);
        
        // Vista por defecto
        if (!template) {
            template = document.getElementById('content-default');
            contentId = 'content-default'; // Asegura que el ID sea 'content-default'
        }

        const newContent = template.cloneNode(true);
        appContentContainer.innerHTML = '';
        appContentContainer.appendChild(newContent);
        
        // Asignar eventos solo al contenido que acabamos de cargar
        // (Esto es un 'router' simple)
        if (contentId === 'section-security') {
            setup2FAToggle(newContent); // Llama a la función de prueba
        }
        if (contentId === 'section-attendance') {
            setupAttendancePage(newContent);
        }
        if (contentId === 'section-shift-management') {
            setupShiftManagement(newContent);
        }
        if (contentId === 'section-eval-form') {
            setupEvalManage(newContent);
        }
        if (contentId === 'section-my-training') {
            setupMyTraining(newContent);
        }
        if (contentId === 'section-training-schedule') {
            setupTrainingSchedule(newContent);
        }
        if (contentId === 'section-dashboard-global') {
            setupDashboardGlobal(newContent);
        }
        if (contentId === 'section-reports-page') {
            setupReportsPage(newContent);
        }
        if (contentId === 'section-admin') {
            setupAdmin(newContent);
        }
        if (contentId === 'section-hr-create') {
            setupCreateUser(newContent);
        }
        if (contentId === 'section-training-register') {
            setupTrainingRegister(newContent);
        }
        if (contentId === 'section-logs') {
            // No necesita JS extra por ahora
        }
         if (contentId === 'section-eval-criteria') {
            setupEvalCriteria(newContent);
        }
    }

    // Navegación principal (la barra lateral)
    document.querySelectorAll('.app-sidebar .nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            showAppContent(targetId);
            setActiveButton(targetId); // Actualiza el indicador
            
            // --- NUEVO: Cierra el menú en móvil al hacer clic ---
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // --- CERRAR SESIÓN ---
    document.getElementById('logout-btn').addEventListener('click', () => {
        document.getElementById('login-form').reset();
        attendanceState = 'OUT'; // Reiniciar estado
        showPageSection('section-login');
    });

    // --- LÓGICA DE COMPONENTES ESPECÍFICOS ---

    // US-48: Autenticación de dos factores
    // (VERSIÓN DE PRUEBA para evitar el SyntaxError por caracteres)
    function setup2FAToggle(contentNode) {
        console.log("Página de Seguridad cargada (función 2FA desactivada para prueba).");
    }

    // OT-51: Simulación de Notificación Push
    function showPushNotification(message) {
        const toast = document.getElementById('push-notification');
        if (message) toast.querySelector('.toast-body').textContent = message;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 5000);
    }

    // OT-58: Confirmación Visual de Asistencia
    function showConfirmation(message, isError = false) {
        const modal = document.getElementById('confirmation-modal');
        const icon = modal.querySelector('.modal-icon');
        modal.querySelector('#modal-message').textContent = message;
        if (isError) {
            icon.textContent = '✖'; icon.style.color = '#dc3545';
        } else {
            icon.textContent = '✔'; icon.style.color = '#28a745';
        }
        modal.classList.add('active');
        setTimeout(() => modal.classList.remove('active'), 2500);
    }

    // Lógica de la página de Asistencia
    function setupAttendancePage(contentNode) {
        const btnClockIn = contentNode.querySelector('#btn-clock-in');
        const btnClockOut = contentNode.querySelector('#btn-clock-out');
        const offlineToggle = contentNode.querySelector('#offline-toggle');
        const statusContainer = contentNode.querySelector('#sync-status-container');
        const btnSimulatePush = contentNode.querySelector('#btn-simulate-push');

        const updateButtonUI = () => {
            if (attendanceState === 'IN') {
                if(btnClockIn) { btnClockIn.disabled = true; btnClockIn.style.opacity = 0.5; btnClockIn.style.cursor = 'not-allowed'; }
                if(btnClockOut) { btnClockOut.disabled = false; btnClockOut.style.opacity = 1; btnClockOut.style.cursor = 'pointer'; }
            } else { // 'OUT'
                if(btnClockIn) { btnClockIn.disabled = false; btnClockIn.style.opacity = 1; btnClockIn.style.cursor = 'pointer'; }
                if(btnClockOut) { btnClockOut.disabled = true; btnClockOut.style.opacity = 0.5; btnClockOut.style.cursor = 'not-allowed'; }
            }
        };
        updateButtonUI();

        const handleAttendance = (action) => {
            const isOffline = offlineToggle.checked;
            statusContainer.style.display = 'block';
            statusContainer.innerHTML = `<p>Registrando ${action}...</p>`;
            if (btnClockIn) btnClockIn.disabled = true;
            if (btnClockOut) btnClockOut.disabled = true;
            const networkTime = 1000;

            setTimeout(() => {
                let confirmationMessage = '';
                if (isOffline) {
                    statusContainer.innerHTML += '<p>Modo Offline: Registro guardado localmente.</p>';
                } else {
                    statusContainer.innerHTML += '<p>Conectado al servidor... Registro exitoso.</p>';
                }
                
                if (action === 'Entrada') {
                    attendanceState = 'IN';
                    confirmationMessage = `¡${action} registrada con éxito!`;
                } else {
                    attendanceState = 'OUT';
                    confirmationMessage = `¡${action} registrada con éxito!`;
                }
                showConfirmation(confirmationMessage);
                updateButtonUI();
                setTimeout(() => { statusContainer.style.display = 'none'; statusContainer.innerHTML = ''; }, 2000);
            }, networkTime);
        };
        
        if (btnClockIn) btnClockIn.addEventListener('click', () => handleAttendance('Entrada'));
        if (btnClockOut) btnClockOut.addEventListener('click', () => handleAttendance('Salida'));

        // Lógica para OT-51
        if (btnSimulatePush) btnSimulatePush.addEventListener('click', () => {
            showPushNotification("Tu turno de mañana ha sido re-asignado a las 10:00 AM.");
        });
    }

    // Lógica de Gestión de Turnos (TU-06 / TU-07)
    function setupShiftManagement(contentNode) {
        const form = contentNode.querySelector('#shift-assign-form');
        if (form) form.addEventListener('submit', (e) => { e.preventDefault(); showConfirmation('¡Turno asignado/modificado!'); });
    }

    // Lógica para Formulario de Evaluación (ED-23, ED-30)
    function setupEvalManage(contentNode) {
        const form = contentNode.querySelector('#eval-form-submit');
        if (form) form.addEventListener('submit', (e) => { e.preventDefault(); showConfirmation('¡Evaluación firmada y enviada!'); });
    }
    
    // Lógica para Criterios de Evaluación (ED-26)
    function setupEvalCriteria(contentNode) {
        const form = contentNode.querySelector('#criteria-form');
        if (form) form.addEventListener('submit', (e) => { e.preventDefault(); showConfirmation('¡Criterio guardado!'); });
    }

    // Lógica para Mis Capacitaciones (CC-13)
    function setupMyTraining(contentNode) {
        const downloadButtons = contentNode.querySelectorAll('#btn-download-cert');
        downloadButtons.forEach(btn => {
            btn.addEventListener('click', () => alert('Simulación: Descargando certificado en PDF...'));
        });
    }
    
    // Lógica para Registrar Participación (CC-14)
    function setupTrainingRegister(contentNode) {
        const form = contentNode.querySelector('#register-training-form');
        if (form) form.addEventListener('submit', (e) => { e.preventDefault(); showConfirmation('¡Asistencia registrada!'); });
    }

    // Lógica para Programar Capacitaciones (CC-17)
    function setupTrainingSchedule(contentNode) {
        const form = contentNode.querySelector('#schedule-training-form');
        if (form) form.addEventListener('submit', (e) => { e.preventDefault(); showConfirmation('¡Nuevo curso programado!'); });
    }
    
    // Lógica para Crear Usuario (US-45)
    function setupCreateUser(contentNode) {
         const form = contentNode.querySelector('#create-user-form');
        if (form) form.addEventListener('submit', (e) => { e.preventDefault(); showConfirmation('¡Usuario creado con éxito!'); });
    }

    // Lógica para el Dashboard Global (RP-40)
    function setupDashboardGlobal(contentNode) {
        const pulse = contentNode.querySelector('.real-time-indicator .pulse');
        if (pulse) pulse.style.animation = 'pulse-live 1.5s infinite';
    }

    // Lógica para la PÁGINA DE REPORTES (Tabs)
    function setupReportsPage(contentNode) {
        const tabButtons = contentNode.querySelectorAll('.tab-nav-btn');
        const tabPanes = contentNode.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                button.classList.add('active');
                contentNode.querySelector('#' + targetTab).classList.add('active');
            });
        });

        // Botones de exportación/impresión
        const btnExcel = contentNode.querySelector('#btn-export-excel');
        const btnPdf = contentNode.querySelector('#btn-export-pdf');
        const btnPrint = contentNode.querySelector('#btn-print-report');
        const btnExportGlobal = contentNode.querySelector('#btn-export-global');

        if (btnExcel) btnExcel.addEventListener('click', () => alert('Simulación: Generando Excel... (TU-10)'));
        if (btnPdf) btnPdf.addEventListener('click', () => alert('Simulación: Generando PDF... (TU-10)'));
        if (btnPrint) btnPrint.addEventListener('click', () => alert('Simulación: Enviando a impresora... (OT-59)'));
        if (btnExportGlobal) btnExportGlobal.addEventListener('click', () => alert('Simulación: Exportando desempeño global... (RP-37)'));
    }

    // Lógica para la PÁGINA DE ADMINISTRACIÓN
    function setupAdmin(contentNode) {
        // Botones de Backup/Restore
        const btnBackup = contentNode.querySelector('#btn-backup-db');
        const btnRestore = contentNode.querySelector('#btn-restore-db');
        if (btnBackup) btnBackup.addEventListener('click', () => showConfirmation('¡Respaldo de BD iniciado! (OT-56)'));
        if (btnRestore) btnRestore.addEventListener('click', () => {
            if (confirm('¿Seguro que quieres restaurar la BD? (OT-57)')) showConfirmation('¡Restauración completada!', true);
        });

        // Botones de "Ir a" (navegación interna que también actualiza el sidebar)
        const navButtons = contentNode.querySelectorAll('.nav-btn-inline');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                showAppContent(targetId);
                setActiveButton(targetId); // Actualiza el indicador
            });
        });
        
        // Formulario de reportes automáticos
        const autoReportForm = contentNode.querySelector('#auto-report-form');
        if (autoReportForm) autoReportForm.addEventListener('submit', (e) => { e.preventDefault(); showConfirmation('Configuración de reportes guardada (RP-34)'); });
    
        // Lógica para OT-53
        const notifConfigForm = contentNode.querySelector('#notif-config-form');
        if (notifConfigForm) notifConfigForm.addEventListener('submit', (e) => { e.preventDefault(); showConfirmation('Configuración de notificaciones guardada (OT-53)'); });

    } // Fin de setupAdmin
    
    // Inicializar la app en la sección de Login
    showPageSection('section-login');
});
