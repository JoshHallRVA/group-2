$(document).ready(function () {
	var blogContainer = $(".blog-container");
	var postCategorySelect = $("#category");

	$(document).on("click", "button.delete", handlePostDelete);
	$(document).on("click", "button.edit", handlePostEdit);

	var posts;

	var url = window.location.search;
	var authorId;
	if (url.indexOf("?author_id=") !== -1) {
		authorId = url.split("=")[1];
		getPosts(authorId);
	} else {
		getPosts();
	}

	function getPosts(author) {
		authorId = author || "";
		if (authorId) {
			authorId = "/?author_id=" + authorId;
		}
		$.get("/api/posts" + authorId, function (data) {
			console.log("Posts", data);
			posts = data;
			if (!posts || !posts.length) {
				displayEmpty(author);
			} else {
				initializeRows();
			}
		});
	}

	function deletePost(id) {
		$.ajax({
			method: "DELETE",
			url: "/api/posts/" + id,
		}).then(function () {
			getPosts(postCategorySelect.val());
		});
	}

	function initializeRows() {
		blogContainer.empty();
		var postsToAdd = [];
		for (var i = 0; i < posts.length; i++) {
			postsToAdd.push(createNewRow(posts[i]));
		}
		blogContainer.append(postsToAdd);
	}

	function createNewRow(post) {
		console.log("post", post);
		var formattedDate = new Date(post.createdAt);
		formattedDate = moment(formattedDate).format(
			"MMMM Do YYYY, h:mm:ss a"
		);
		var newPostCard = $("<div>");
		newPostCard.addClass("card");
		newPostCard.css({
			border: "5px solid gray",
		});
		var newPostCardHeading = $("<div>");
		newPostCardHeading.addClass("card-header");
		newPostCardHeading.css({
			color: "pink",
			background: "rgba(5, 14, 97, 0.705)",
		});
		var deleteBtn = $("<button>");
		deleteBtn.text("Delete");
		deleteBtn.css({
			margin: "20px",
		});
		deleteBtn.addClass("delete btn btn-danger");
		var editBtn = $("<button>");
		editBtn.text("EDIT");
		editBtn.addClass("edit btn btn-info");
		editBtn.css({
			margin: "20px",
		});
		var newPostName = $("<h1>");
		newPostName.css({
			margin: "0px 0px 20px 20px",
		});
		var newPostDate = $("<small>");
		newPostDate.css({
			margin: "0px 0px 20px 20px",
		});
		var newPostEmail = $("<h3>");
		newPostEmail.text("Email: " + post.email);
		newPostEmail.css({
			margin: "20px 0px 20px 20px",
		});
		var newPostStyle = $("<h4>");
		newPostStyle.css({
			margin: "20px",
		});
		var newPostBrand = $("<h4>");
		newPostBrand.css({
			margin: "20px",
		});
		var newPostSize = $("<h4>");
		newPostSize.css({
			margin: "20px",
		});
		var newPostPrice = $("<h4>");
		newPostPrice.css({
			margin: "20px 20px 20px 20px",
		});
		var newPostAuthor = $("<h5>");
		newPostAuthor.text("Written by: " + post.name);
		newPostAuthor.css({
			float: "right",
			color: "White",
			margin: "10px",
		});

		var newPostImage = $("<img>")
			.attr("src", post.image)
			.addClass("card-img-top");
		newPostImage.css({
			float: "right",
			margin: "80px 80px 0px 0px",
			height: "300px",
			width: "300px",
		});
		var newPostCardBody = $("<div>");
		newPostCardBody.addClass("card-body");

		var newPostBody = $("<p>");

		newPostName.text(post.name + " ");
		newPostEmail.text(post.email);
		newPostStyle.text(post.style);
		newPostBrand.text(post.brand);
		newPostSize.text(post.size);
		newPostPrice.text(post.price);
		newPostDate.text(formattedDate);
		newPostName.append(newPostDate);
		newPostCardHeading.append(deleteBtn);
		newPostCardHeading.append(editBtn);
		newPostCardHeading.append(newPostName);
		newPostCardHeading.append(newPostDate);
		newPostCardHeading.append(newPostEmail);
		newPostCardHeading.append(newPostStyle);
		newPostCardHeading.append(newPostBrand);
		newPostCardHeading.append(newPostSize);
		newPostCardHeading.append(newPostPrice);
		newPostCardHeading.append(newPostAuthor);
		newPostCardHeading.css({
			margin: "50px",
		});
		newPostCard.append(newPostImage);

		newPostCardBody.append(newPostBody);
		newPostCard.append(newPostCardHeading);
		newPostCard.append(newPostCardBody);
		newPostCard.data("post", post);
		return newPostCard;
	}

	function handlePostDelete() {
		var currentPost = $(this).parent().parent().data("post");
		deletePost(currentPost.id);
	}

	function handlePostEdit() {
		var currentPost = $(this).parent().parent().data("post");
		window.location.href = "/cms?post_id=" + currentPost.id;
	}

	function displayEmpty(id) {
		var query = window.location.search;
		var partial = "";
		if (id) {
			partial = " for Author #" + id;
		}
		blogContainer.empty();
		var messageH2 = $("<h2>");
		messageH2.css({ "text-align": "center", "margin-top": "50px" });
		messageH2.html(
			"No posts yet" +
				partial +
				", navigate <a href='/cms" +
				query +
				"'>here</a> in order to get started."
		);
		blogContainer.append(messageH2);
	}
});
