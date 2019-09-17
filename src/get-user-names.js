const api = `https://randomuser.me/api/?results=5&seed=robot-preact&nat=us&inc=name&noinfo`;
const getName = user => `${user.name.first} ${user.name.last}`;

async function getUserNames(page) {
  let url = `${api}&page=${page}`;
  let res = await fetch(url);
  let json = await res.json();

  return json.results.map(getName);
}

export { getUserNames as default };
