
($(document).ready(() => {
  
  console.log('hello world!')

  let state = {
    createAppointment: false
  }

  
  
  /////////////////////////////////////////////////////////////////////
  // Listeners
  ////////////////////////////////////////////////////////////////////

    const submitSearch = () => {
      $('#appt_search').submit(function(event) {
        event.preventDefault();
        
        console.log('form submitted');
        let input = $('#search').val()
        if ($('#search_category').val() === 'user') {
          getAppointments(input);
        }
      });
    };


    const submitCreate = () => {
      $('#create_appt').submit(function(event) {
        event.preventDefault();

        if (state.createAppointment) {

          console.log('appointment create form submitted');
          let inputs = {
            user: $('#user').val(),
            date: $('#date').val(),
            time: $('#time').val(),
            description: $('#description').val()
          }
          console.log(inputs);
        
        }
      })
    }

    const newButton = () => {
      
      $('#addNewButton').click(function(event) {
        event.preventDefault();
        console.log(state.createAppointment)
        if (!state.createAppointment) {
          $('#hideform').removeClass('hidden');
          $('#cancel').removeClass('hidden');
          $(this).text('Create');
          $(this).attr({'type': 'submit', 'disabled':true});
          
          state.createAppointment = true; 
          $('#addNewButton').off();  
          submitCreate();
        }
      })
    }

    const cancelButton = () => {

      $('#cancel').click(function(event) {
        if (state.createAppointment) {
          $('#hideform').addClass('hidden');
          $('#addNewButton').attr({'type':'button', 'disabled': false});
          $('#addNewButton').text('New');
          state.createAppointment = false;
          $(this).addClass('hidden');
          $('#create_app').off();
          newButton();
        }
      })
    }


    const checkEmpty = () => {

      $('#create_appt input').keyup(function(event) {
        let user = $('#user').val();
        let date = $('#date').val();
        let time = $('#time').val();
        let description = $('#description').val();
        
        if (user && date && time && description) {
          console.log('the fields are not empty');
          $('#addNewButton').attr('disabled', false)
          }
      })
    }




  ////////////////////////////////////////////////////////////////////
  // AJAX
  ////////////////////////////////////////////////////////////////////
  
    const getAppointments = (user="") => {
      const options = {
        method: "GET",
        url: `/appointments/${user}`,
        contentType: 'application/json',
        data: {
          hello: "test"
        }
      }

      return $.ajax(options)
        .then((appointments) => {
          console.log(appointments)
        })
        .catch((err) => {
          console.log('Server errored');
          // TODO: get rid of loader
        })
    }


    const postAppointment = () => {
      const options = {
        method: "POST",
        url: `/appointments/`,
        data: {
          'hello': "test"
        }
      }

      return $.ajax(options)
        .then((appointment) => {
          console.log(appointment)
        })
        .catch((err) => {
          console.log('Server errored');
          // TODO: get rid of loader
        })
    }






    const init = () => {
      getAppointments();
      submitSearch();
      newButton();
      cancelButton();
      checkEmpty();
    }

    init();


}))