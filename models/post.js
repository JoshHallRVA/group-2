module.exports = function (sequelize, DataTypes) {
	var Post = sequelize.define("Post", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1],
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1],
			},
		},
		style: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1],
			},
		},
		brand: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1],
			},
		},
		size: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1],
			},
		},
		price: {
			type: DataTypes.TEXT,
			allowNull: false,
			len: [1],
		},
	});

	Post.associate = function (models) {
		// We're saying that a Post should belong to an Author
		// A Post can't be created without an Author due to the foreign key constraint
		Post.belongsTo(models.Author, {
			foreignKey: {
				allowNull: false,
			},
		});
	};

	return Post;
};
