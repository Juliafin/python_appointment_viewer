($(document).ready(() => {
  let state = {
    createAppointment: false
  };

  /////////////////////////////////////////////////////////////////////
  // Listeners
  ////////////////////////////////////////////////////////////////////

    const submitSearch = () => {
      $('#appt_search').submit(function(event) {
        event.preventDefault();
        
        console.log('form submitted');
        let input = $('#search').val()
        if ($('#search_category').val() === 'user') {
          getAppointments('user', input);
        } else if ($('#search_category').val() === 'description') {
          getAppointments('description', input);
        } else {
          getAppointments()
        }
      });
    };


    const submitCreate = () => {
      $('#create_appt').submit(function(event) {
        event.preventDefault();

        if (state.createAppointment) {

          console.log('appointment create form submitted');
          
          let dateTime =  moment($('#date').val() + ' ' + $('#time').val(), 'YYYY-MM-DD hh:mm')
          let inputs = {
            user: $('#user').val(),
            datetime: dateTime.toISOString(),
            description: $('#description').val(),
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
          }
          console.log(inputs); 
          postAppointment(inputs)
        }
      });
    };

    const newButton = () => {
      
      $('#addNewButton').click(function(event) {
        event.preventDefault();
        console.log(state.createAppointment)
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


    const checkEmpty = () => {

      $('#create_appt input').keyup(function(event) {
        let user = $('#user').val();
        let date = $('#date').val();
        let time = $('#time').val();
        let description = $('#description').val();
        
        if (user && date && time && description) {
          $('#addNewButton').attr({
            disabled: false,
            'data-toggle':'modal',
            'data-target': '#create_appt_modal'
          })
          }
      })
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
      console.log(options)

      return $.ajax(options)
        .then((appointments) => {
          // console.log(appointments)
          state.appointments = appointments;
          console.log('these are the appointments', state.appointments)
          renderTable(state.appointments);
        })
        .catch((err) => {
          console.log('Server error', err);
          // TODO: get rid of loader
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
          console.log(appointment)
          getAppointments();
        })
        .catch((err) => {
          console.log('Server errored');
          if (err.responseJSON) {
            console.log(err.responseJSON)
          }
          // TODO: get rid of loader
        });
    };


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
    </tr>
    </thead>
    `;

    tableData.forEach(row => {
      let rowTemplate = `
        <tr id=${row.id}>
          <td>${row.user}</td>
          <td>${moment(row.datetime).format('h:mm A on MMMM Do, YYYY')}</td>
          <td>${row.description}</td>
        </tr>`
      tableTemplate += rowTemplate;
    });

    $('table.table').append(tableTemplate);
    $(document).scrollTop(0);
  }



    ////////////////////////////////////////////////////////////////////
  // Utils
  ////////////////////////////////////////////////////////////////////







    const init = () => {
      getAppointments();
      submitSearch();
      newButton();
      cancelButton();
      checkEmpty();
    };

    init();


}))