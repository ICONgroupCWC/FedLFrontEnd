


export function fetchData (data, method)  {

    const base_url = 'http://localhost:5000/'
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
      }
    return fetch(base_url + method, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        
        return responseData;
      })
      .catch(error => console.warn(error));


    //   .then((blob) => {
    //     // Create blob link to download
    //     const url = window.URL.createObjectURL(
    //       new Blob([blob]),
    //     );
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute(
    //       'download',
    //       `model.pt`,
    //     );

    //     // Append to html link element page
    //     document.body.appendChild(link);

    //     // Start download
    //     link.click();

    //     // Clean up and remove the link
    //     link.parentNode.removeChild(link);
    //   });
  }