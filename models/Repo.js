const { model, Schema } = require('mongoose');

const RepoSchema = new Schema({
    username: String,
    owner: String,
    fullName: String,
    name: String,
    url: String,
    gitUrl: String,
    liked: Boolean,
    createAt: String,
    repoId: String,
    language: String
});

module.exports = model('Repo', RepoSchema);