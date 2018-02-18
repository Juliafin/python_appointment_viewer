
($(document).ready(function() {
  
  console.log('hello world!')

  function getAppointments(user="") {
    const options = {
      method: "GET",
      url: `/appointments/${user}`
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


  getAppointments();


}))