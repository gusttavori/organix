  document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('container');
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const toggleButton = document.getElementById('mobileToggle');

    if (signUpButton) {
      signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
        if (toggleButton) toggleButton.textContent = "Login";
      });
    }

    if (signInButton) {
      signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
        if (toggleButton) toggleButton.textContent = "Cadastre-se";
      });
    }

    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        container.classList.toggle('right-panel-active');

        if (container.classList.contains('right-panel-active')) {
          toggleButton.textContent = 'Login';
        } else {
          toggleButton.textContent = 'Cadastre-se';
        }
      });

      // Define o texto inicial baseado no estado atual
      toggleButton.textContent = container.classList.contains('right-panel-active') ? 'Login' : 'Cadastre-se';
    }
  });