let state = {
  createAppointment: false
};
($(document).ready(() => {


  /////////////////////////////////////////////////////////////////////
  // Listeners
  ////////////////////////////////////////////////////////////////////

    // Search form listener
    const submitSearch = () => {
      $('#appt_search').submit(function(event) {
        event.preventDefault();
        
        let input = $('#search').val()
        if ($('#search_category').val() === 'user') {
          getAppointments('user', input);
        } else if ($('#search_category').val() === 'description') {
          getAppointments('description', input);
        } else {
          getAppointments()
        }
        $('#search').val('')
      });
    };


    // Appointment creation listener - Form submit
    const submitCreate = () => {
      $('#create_appt').submit(function(event) {
        event.preventDefault();

        if (state.createAppointment) {          
          let dateTime =  moment($('#date').val() + ' ' + $('#time').val(), 'YYYY-MM-DD hh:mm')
          let inputs = {
            user: $('#user').val(),
            datetime: dateTime.toISOString(),
            description: $('#description').val(),
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
          }

          let foundAppt = state.appointments.find((appointment) => {
            let inputTime = moment(inputs.datetime).format('YYYY-MM-DD HH:mm');
            let stateTime = moment(appointment.datetime).format('YYYY-MM-DD HH:mm');
            return appointment.user === inputs.user && inputTime === stateTime        
          });

          if (!foundAppt) {
            postAppointment(inputs)
            showModal(true, inputs);
          } else {
            showModal(false);
          }
        }
      });
    };


    // Appointment form reveal listener
    const newButton = () => {
      
      $('#addNewButton').click(function(event) {
        event.preventDefault();
        if (!state.createAppointment) {
          $('#hideform').removeClass('hidden');
          $('#cancel').removeClass('hidden');
          $(this).text('Create');
          $(this).attr({type: 'submit', disabled:true});
          
          state.createAppointment = true; 
          $('#addNewButton').off();  
          submitCreate();
        }
      });
    };

    // Appointment form hide listener
    const cancelButton = () => {

      $('#cancel').click(function(event) {
        if (state.createAppointment) {
          $('#hideform').addClass('hidden');
          $('#addNewButton').attr({type:'button', disabled: false});
          $('#addNewButton').text('New');
          state.createAppointment = false;
          $(this).addClass('hidden');
          $('#create_app').off();
          newButton();
        }
      })
    };


    // Checking if fields are empty on appointment creation form
    const checkEmpty = () => {

      $('#create_appt input').keyup(function(event) {
        let user = $('#user').val();
        let date = $('#date').val();
        let time = $('#time').val();
        let description = $('#description').val();
        
        if (user && date && time && description) {
          $('#addNewButton').attr({
            disabled: false
          })
          }
      })
    };


    // Delete buttons in table
    const deleteButton = () => {
      
      $('table.table').on('click', '.delete_appointment', function(event) {

        let appointmentToDelete = {
          id:$(this).closest('tr').attr('id'),
          csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
        };
        deleteAppointment(appointmentToDelete);


      });
    };


  ////////////////////////////////////////////////////////////////////
  // AJAX
  ////////////////////////////////////////////////////////////////////
  
    const getAppointments = (type="", searchTerm="") => {

      const options = {
        method: "GET",
        url: `/appointments/`,
        contentType: 'application/json',
        data: {type: type || "default", searchTerm}
      };

      return $.ajax(options)
        .then((appointments) => {
          state.appointments = appointments;
          renderTable(state.appointments);
        })
        .catch((err) => {
        })
    };


    const postAppointment = (data) => {
      const options = {
        method: "POST",
        url: `/appointments/`,
        data
      };

      return $.ajax(options)
        .then((appointment) => {
          clearAppointmentForm();
          getAppointments();
        })
        .catch((err) => {
          if (err.responseJSON) {
          }
        });
    };


    const deleteAppointment = (data) => {
      const options = {
        method: "POST",
        url: `/appointments/delete`,
        data
      };

      return $.ajax(options)
        .then((appointment) => {
          getAppointments();
        })
        .catch((err) => {
          if (err.responseJSON) {
          }
        });

    }


  ////////////////////////////////////////////////////////////////////
  // Render
  ////////////////////////////////////////////////////////////////////


  const renderTable = (tableData) => {
    $('table.table').empty();

    let tableTemplate = `
    <thead>
    <tr>
      <th scope="col">User</th>
      <th scope="col">Appointment Time</th>
      <th scope="col">Description</th>
      <th scope="col"></th>
    </tr>
    </thead>
    `;

    tableData.forEach(row => {
      let rowTemplate = `
        <tr id=${row.id}>
          <td>${row.user}</td>
          <td>${moment(row.datetime).format('h:mm A on MMMM Do, YYYY')}</td>
          <td>${row.description}</td>
          <td><button class="btn btn-danger delete_appointment">Delete</button></td>
        </tr>`
      tableTemplate += rowTemplate;
    });

    $('table.table').append(tableTemplate);
  }


  ////////////////////////////////////////////////////////////////////
  // Utils
  ////////////////////////////////////////////////////////////////////

  // Clear form after submit
    const clearAppointmentForm = () => {
      $('#user').val('')
      $('#date').val('')
      $('#time').val('')
      $('#description').val('')
    }

    // Display the correct modal whether appointment exists or not
    const showModal = (success=true, appointment="") => {
      if (!success) {
        console.log('running with fail');
        $('.modal-body').text('');
        $('.modal-title').text('The appointment already exists');
        $('#modal_button').addClass('btn-danger');
        $('#create_appt_modal').modal('show');
      } else {
        let dateTime = moment(appointment.datetime).format('h:mm A on MMMM Do, YYYY');
        let apptCreated = `${appointment.description} for ${appointment.user} at ${dateTime}`;
        $('.modal-body').text(apptCreated);
        $('.modal-title').text('Appointment successfully created!');
        $('#modal_button').addClass('btn-success')
        $('#create_appt_modal').modal('show');
      }
    }



    // Initialize app
    const init = () => {
      getAppointments();
      submitSearch();
      newButton();
      cancelButton();
      checkEmpty();
      deleteButton();
    };

    init();


}))