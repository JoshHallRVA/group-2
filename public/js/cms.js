$(document).ready(function () {
	// Getting jQuery references to the post body, title, form, and author select
	var nameInput = $("#reserve-name");
	var emailInput = $("#reserve-email");
	var styleInput = $("#reserve-style");
	var brandInput = $("#reserve-brand");
	var shoeSizeInput = $("#reserve-shoeSize");
	var priceInput = $("#reserve-price");
	var cmsForm = $("#cms");
	var authorSelect = $("#author");
	var response; 
	// Adding an event listener for when the form is submitted
	$(cmsForm).on("submit", handleFormSubmit);
	// Gets the part of the url that comes after the "?" (which we have if we're updating a post)
	var url = window.location.search;
	var postId;
	var authorId;
	// Sets a flag for whether or not we're updating a post to be false initially
	var updating = false;

	// If we have this section in our url, we pull out the post id from the url
	// In '?post_id=1', postId is 1
	if (url.indexOf("?post_id=") !== -1) {
		postId = url.split("=")[1];
		getPostData(postId, "post");
	}
	// Otherwise if we have an author_id in our url, preset the author select box to be our Author
	else if (url.indexOf("?author_id=") !== -1) {
		authorId = url.split("=")[1];
	}

	// Getting the authors, and their posts
	getAuthors();

	// A function for handling what happens when the form to create a new post is submitted
	function handleFormSubmit(event) {
		event.preventDefault();
		console.log("submit");
		// Wont submit the post if we are missing a body, title, or author
		// if (
		// 	!nameInput.val().trim() ||
		// 	!emailInput.val().trim() ||
		// 	!styleInput.val().trim() ||
		// 	!brandInput.val().trim() ||
		// 	!shoeSizeInput.val().trim() ||
		// 	!priceInput.val().trim() ||
		// 	!authorSelect.val()
		// ) {
		// 	return;
		// }
		// Constructing a newPost object to hand to the database
		var newPost = {
			name: nameInput.val().trim(),
			email: emailInput.val().trim(),
			style: styleInput.val().trim(),
			brand: brandInput.val().trim(),
			size: shoeSizeInput.val().trim(),
			price: priceInput.val().trim(),
			AuthorId: authorSelect.val(),
			image: response.url,
		};
		console.log("newPost", newPost);
		// If we're updating a post run updatePost to update a post
		// Otherwise run submitPost to create a whole new post
		if (updating) {
			newPost.id = postId;
			updatePost(newPost);
		} else {
			submitPost(newPost);
		}
	}

	// Submits a new post and brings user to blog page upon completion
	function submitPost(post) {
		$.post("/api/posts", post, function () {
			window.location.href = "/blog";
		});
	}

	// Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
	function getPostData(id, type) {
		var queryUrl;
		switch (type) {
			case "post":
				queryUrl = "/api/posts/" + id;
				break;
			case "author":
				queryUrl = "/api/authors/" + id;
				break;
			default:
				return;
		}
		$.get(queryUrl, function (data) {
			if (data) {
				console.log(data.AuthorId || data.id);
				// If this post exists, prefill our cms forms with its data
				nameInput.val(data.name);
				emailInput.val(data.email);
				styleInput.val(data.style);
				brandInput.val(data.brand);
				shoeSizeInput.val(data.size);
				priceInput.val(data.price);
				authorId = data.AuthorId || data.id;
				// If we have a post with this id, set a flag for us to know to update the post
				// when we hit submit
				updating = true;
			}
		});
	}

	// A function to get Authors and then render our list of Authors
	function getAuthors() {
		$.get("/api/authors", renderAuthorList);
	}
	// Function to either render a list of authors, or if there are none, direct the user to the page
	// to create an author first
	function renderAuthorList(data) {
		if (!data.length) {
			window.location.href = "/authors";
		}
		$(".hidden").removeClass("hidden");
		var rowsToAdd = [];
		for (var i = 0; i < data.length; i++) {
			rowsToAdd.push(createAuthorRow(data[i]));
		}
		authorSelect.empty();
		console.log(rowsToAdd);
		console.log(authorSelect);
		authorSelect.append(rowsToAdd);
		authorSelect.val(authorId);
	}

	// Creates the author options in the dropdown
	function createAuthorRow(author) {
		var listOption = $("<option>");
		listOption.attr("value", author.id);
		listOption.text(author.name);
		return listOption;
	}

	// Update a given post, bring user to the blog page when done
	function updatePost(post) {
		$.ajax({
			method: "PUT",
			url: "/api/posts",
			data: post,
		}).then(function () {
			window.location.href = "/blog";
		});
	}

	//Starting s3 logic below 

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
	  
	 function getSignedRequest(file) {
		console.log("requesting credentials", file)
	  
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					console.log("getting response")
					console.log(xhr)
	  
					response = JSON.parse(xhr.responseText);
					uploadFile(file, response.signedRequest, response.url);
				}
				else {
					alert('Could not get signed URL.');
				}
			}
		};
		xhr.send();
	 }
	  
	  
	 function uploadFile(file, signedRequest, url) {
		console.log("uploading file", signedRequest, url)
		const xhr = new XMLHttpRequest();
		xhr.open('PUT', signedRequest);
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					document.getElementById('preview').src = url;
				
				}
				else {
					alert('Could not upload file.');
				}
			}
		};
		xhr.send(file);
	 }
	 
	 
});
