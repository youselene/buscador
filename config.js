  // Verificar si el usuario ha iniciado sesión
  function checkSession() {
    // Verificar si la cookie o el valor de almacenamiento local está presente y es válido
    // Aquí asumimos que estás utilizando cookies como método de almacenamiento
    const isLoggedIn = document.cookie.includes('isLoggedIn=true');
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';

    // Si el usuario no ha iniciado sesión, redirigirlo a la página de inicio de sesión
    if (!isLoggedIn && !isAuthenticated) {
      window.location.href = 'https://www.youselene.github.io/buscador/';
    }
  }

  // Llamar a la función de verificación de sesión al cargar la página
  checkSession();

  // Función para realizar la búsqueda en Google Sheets
  function searchInGoogleSheets(searchTerm) {
    // Obtén solo los números de la URL utilizando una expresión regular
    var numbers = searchTerm.match(/\d{5,}/g);

    // Verifica si se encontraron números en el término de búsqueda
    if (numbers !== null) {
      // Obtiene el primer número encontrado
      var number = numbers[0];

      // ID de la hoja de cálculo de Google Sheets
      var spreadsheetId = '1uxwfQA1Dj7XHechUB2GWaYhq-VPl2rMzPepNSE3zDtM';

      // Nombre de la hoja de cálculo en la que se realizará la búsqueda
      var sheetName = 'shutterstock';

      // Credenciales de autenticación de la API de Google Sheets
      var apiKey = 'AIzaSyDCWMQksGjZpej-HmgTNe2fP_HQp4og0Bc'; // Reemplaza con tu propia API Key

      // Construir la URL de la solicitud a la API de Google Sheets
      var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

      // Realizar la solicitud GET para obtener los datos de la hoja de cálculo
      fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          var rows = data.values;
          var results = [];

          // Recorrer las filas y buscar el número en la columna A
          for (var i = 0; i < rows.length; i++) {
          if (rows[i][0] && rows[i][0] === number) {
            results.push(rows[i][1]); // Agregar el valor de la columna B al resultado
          }
        }

          // Mostrar los resultados en la página web
          var resultsContainer = document.querySelector('.search-results');
          resultsContainer.innerHTML = '';

          if (results.length > 0) {
            for (var k = 0; k < results.length; k++) {
              var resultLink = document.createElement('a');
              resultLink.href = results[k]; // Establecer la URL como el resultado
              resultLink.textContent = results[k]; // Establecer el texto del enlace como el resultado
              resultLink.target = '_blank'; // Abrir enlace en una nueva pestaña
              resultLink.rel = 'noopener noreferrer'; // Configurar atributos de seguridad para enlaces externos
              resultsContainer.appendChild(resultLink);
              resultsContainer.appendChild(document.createElement('br'));
            }
          } else {
            var noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'No se encontraron resultados.';
            resultsContainer.appendChild(noResultsMessage);
          }
        })
        .catch(function(error) {
          console.log('Error al obtener los datos de Google Sheets:', error);
        });
    } else {
      // No se encontraron números en el término de búsqueda
      var resultsContainer = document.querySelector('.search-results');
      resultsContainer.innerHTML = '';

      var noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'Por favor, ingrese una URL';
      resultsContainer.appendChild(noResultsMessage);
    }
  }

  // Obtener el formulario de búsqueda
  var searchForm = document.querySelector('.search-form');

     // Agregar un evento de envío de formulario
      searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var searchTerm = searchForm.querySelector('input[name="search-term"]').value;

        // Validar si se ingresó un término de búsqueda
        if (searchTerm.trim() !== '') {
          searchInGoogleSheets(searchTerm);
        } else {
          var resultsContainer = document.querySelector('.search-results');
          resultsContainer.innerHTML = '';

          var noResultsMessage = document.createElement('p');
          noResultsMessage.textContent = 'Por favor, ingrese un término de búsqueda.';
          resultsContainer.appendChild(noResultsMessage);
        }
      });
