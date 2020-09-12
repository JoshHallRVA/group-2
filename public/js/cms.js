$(document).ready(function () {
	var nameInput = $("#reserve-name");
	var emailInput = $("#reserve-email");
	var styleInput = $("#reserve-style");
	var brandInput = $("#reserve-brand");
	var shoeSizeInput = $("#reserve-shoeSize");
	var priceInput = $("#reserve-price");
	var cmsForm = $("#cms");
	var authorSelect = $("#author");
	var response;

	$(cmsForm).on("submit", handleFormSubmit);

	var url = window.location.search;
	var postId;
	var authorId;

	var updating = false;

	if (url.indexOf("?post_id=") !== -1) {
		postId = url.split("=")[1];
		getPostData(postId, "post");
	} else if (url.indexOf("?author_id=") !== -1) {
		authorId = url.split("=")[1];
	}

	getAuthors();

	function handleFormSubmit(event) {
		event.preventDefault();
		console.log("submit");

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

		if (updating) {
			newPost.id = postId;
			updatePost(newPost);
		} else {
			submitPost(newPost);
		}
	}

	function submitPost(post) {
		$.post("/api/posts", post, function () {
			window.location.href = "/blog";
		});
	}

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

				nameInput.val(data.name);
				emailInput.val(data.email);
				styleInput.val(data.style);
				brandInput.val(data.brand);
				shoeSizeInput.val(data.size);
				priceInput.val(data.price);
				authorId = data.AuthorId || data.id;

				updating = true;
			}
		});
	}

	function getAuthors() {
		$.get("/api/authors", renderAuthorList);
	}

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

	function createAuthorRow(author) {
		var listOption = $("<option>");
		listOption.attr("value", author.id);
		listOption.text(author.name);
		return listOption;
	}

	function updatePost(post) {
		$.ajax({
			method: "PUT",
			url: "/api/posts",
			data: post,
		}).then(function () {
			window.location.href = "/blog";
		});
	}

	(() => {
		document.getElementById("file-input").onchange = () => {
			const files = document.getElementById("file-input").files;
			const file = files[0];
			if (file == null) {
				return alert("No file selected.");
			}
			getSignedRequest(file);
		};
	})();

	function getSignedRequest(file) {
		console.log("requesting credentials", file);

		const xhr = new XMLHttpRequest();
		xhr.open(
			"GET",
			`/sign-s3?file-name=${file.name}&file-type=${file.type}`
		);
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					console.log("getting response");
					console.log(xhr);

					response = JSON.parse(xhr.responseText);
					uploadFile(file, response.signedRequest, response.url);
				} else {
					alert("Could not get signed URL.");
				}
			}
		};
		xhr.send();
	}

	function uploadFile(file, signedRequest, url) {
		console.log("uploading file", signedRequest, url);
		const xhr = new XMLHttpRequest();
		xhr.open("PUT", signedRequest);
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					document.getElementById("preview").src = url;
				} else {
					alert("Could not upload file.");
				}
			}
		};
		xhr.send(file);
	}
});
