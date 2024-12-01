document.addEventListener("DOMContentLoaded", function() {
  let url = 'https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php';
  
  // use fetch to request data from an API
 
  fetch(url)
      .then( response => {
       if (response.ok) {
         return response.json();
  } else {
    return Promise.reject({
       status: response.status,
       statusText: response.statusText
      })
   }
  })
.then( data => { console.log(data); } )
.catch( err => { console.log('err='+err) });

});












