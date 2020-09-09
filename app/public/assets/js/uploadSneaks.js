(() => {
    document.getElementById("file-input").onchange = () => {
        const files = document.getElementById('file-input').files;
        const file = files[0];
        if (file == null) {
            return alert('No file selected.');
        }
        getSignedRequest(file);
    };
})();

function getSignedRequestL(file) {
    console.log("requesting credentials", file)

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("getting response")
                console.log(xhr)

                const response = JSON.parse(xhr.responseText);
                uploadFile(file, response.signedRequest, response.url);
            }
            else {
                alert('Could not get signed URL.');
            }
        }
    };
    xhr.send();
}
async function getSignedRequest(file) {
    const queryUrl = `/api/sign-s3?file-name=${file.name}&file-type=${file.type}`;
    try {
      const response = await fetch(queryUrl, {
        method: 'GET',
      });
      const data = await response.json();
      upLoadFile(file, data.signedRequest, data.url);
    } catch (err) {
      console.log("error", err);
      alert('Could not get signed URL.');
    }
  }

function uploadFile(file, signedRequest, url) {
    console.log("uploading file", signedRequest, url)
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.getElementById('preview').src = url;
                document.getElementById('avatar-url').value = url;
            }
            else {
                alert('Could not upload file.');
            }
        }
    };
    xhr.send(file);
}