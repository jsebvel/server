const { AuthenticationError, UserInputError } = require('apollo-server');
const Repo = require('../../models/Repo');
const checkAuth = require('../../util/checkAuth');


module.exports = {
    Query: {
        async getFavRepos() {
            try {
                const repos = await Repo.find().sort({ createdAt: -1 });
                return repos
            } catch (error) {
                throw new Error(error)
            }
        },
        async getRepo(_, { repoId }) {
            try {
                const repo = await Repo.findById(repoId);
                if (repo) {
                    return repo;
                } else {
                    throw new Error('Repo not found');
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createFavRepo(_, {
            id,
            repoId,
            username,
            owner,
            fullName,
            name,
            url,
            gitUrl,
            liked,
            language
        }, context) {
            console.log(repoId, 'REPOID')
            const user = checkAuth(context);
            const repo = await Repo.findOne({ repoId: repoId });
            if (repo) {
                await repo.delete();
                return;
            } else {
                const newFavRepo = new Repo({
                    repoId,
                    username,
                    owner,
                    fullName,
                    name,
                    url,
                    gitUrl,
                    liked,
                    language,
                    createdAt: new Date().toISOString()
                });
                const repo = await newFavRepo.save();
                return repo;
            }


        }
    }
}