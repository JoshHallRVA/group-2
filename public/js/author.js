$(document).ready(function () {
	var nameInput = $("#author-name");
	var authorList = $("tbody");
	var authorContainer = $(".author-container");

	$(document).on("submit", "#author-form", handleAuthorFormSubmit);
	$(document).on("click", ".delete-author", handleDeleteButtonPress);

	getAuthors();

	function handleAuthorFormSubmit(event) {
		event.preventDefault();

		if (!nameInput.val().trim().trim()) {
			return;
		}

		upsertAuthor({
			name: nameInput.val().trim(),
		});
	}

	function upsertAuthor(authorData) {
		$.post("/api/authors", authorData).then(getAuthors);
	}

	function createAuthorRow(authorData) {
		var newTr = $("<tr>");
		newTr.data("author", authorData);
		newTr.append("<td>" + authorData.name + "</td>");
		if (authorData.Posts) {
			newTr.append("<td> " + authorData.Posts.length + "</td>");
		} else {
			newTr.append("<td>0</td>");
		}
		newTr.append(
			"<td><a href='/blog?author_id=" +
				authorData.id +
				"'>Go to Posts</a></td>"
		);
		newTr.append(
			"<td><a href='/cms?author_id=" +
				authorData.id +
				"'>Create a Post</a></td>"
		);
		newTr.append(
			"<td><a style='cursor:pointer;color:red' class='delete-author'>Delete Author</a></td>"
		);
		return newTr;
	}

	function getAuthors() {
		$.get("/api/authors", function (data) {
			var rowsToAdd = [];
			for (var i = 0; i < data.length; i++) {
				rowsToAdd.push(createAuthorRow(data[i]));
			}
			renderAuthorList(rowsToAdd);
			nameInput.val("");
		});
	}

	function renderAuthorList(rows) {
		authorList.children().not(":last").remove();
		authorContainer.children(".alert").remove();
		if (rows.length) {
			console.log(rows);
			authorList.prepend(rows);
		} else {
			renderEmpty();
		}
	}

	function renderEmpty() {
		var alertDiv = $("<div>");
		alertDiv.addClass("alert alert-danger");
		alertDiv.text(
			"You Must become a HypeBeast before you can create a post!"
		);
		authorContainer.append(alertDiv);
	}

	function handleDeleteButtonPress() {
		var listItemData = $(this)
			.parent("td")
			.parent("tr")
			.data("author");
		var id = listItemData.id;
		$.ajax({
			method: "DELETE",
			url: "/api/authors/" + id,
		}).then(getAuthors);
	}
});
