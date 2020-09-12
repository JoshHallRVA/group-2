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

		image: {
			type: DataTypes.STRING,
		},
	});

	Post.associate = function (models) {
		Post.belongsTo(models.Author, {
			foreignKey: {
				allowNull: false,
			},
		});
	};

	return Post;
};
