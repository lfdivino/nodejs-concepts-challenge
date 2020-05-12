const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validate_params = (title, url, techs, likes) => {
  if (!title) {
    return 'Title field required';
  }
  if (!url) {
    return 'Url field required';
  }
  if (!techs) {
    return 'Techs field required';
  }

  return ''
};

const get_repository_by_id = (id, response) => {
  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not founded' });
  }

  return repositoryIndex;
};

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  validate_params_errors = validate_params(title, url, techs);

  if (validate_params_errors != '') {
    return response.status(400).json({ error: validate_params_errors});
  }

  repository = {
    'id': uuid(),
    'title': title,
    'url': url,
    'techs': techs,
    'likes': 0,
  }
  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  if (likes) {
    return response.json(repositories.find(repository => repository.id === id));
  }

  repositoryIndex = get_repository_by_id(id, response);

  validate_params_errors = validate_params(title, url, techs);

  if (validate_params_errors != '') {
    return response.status(400).json({ error: validate_params_errors});
  }

  repository = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: repositories[repositoryIndex].likes,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositoryIndex = get_repository_by_id(id, response);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  repositoryIndex = get_repository_by_id(id, response);

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1

  return response.json(repositories[repositoryIndex]);

});

module.exports = app;
