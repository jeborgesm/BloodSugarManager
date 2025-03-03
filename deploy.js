const ghpages = require('gh-pages');
const path = require('path');

ghpages.publish(path.join(__dirname, 'build'), {
  branch: 'gh-pages',
    repo: 'https://github.com/jeborgesm/BloodSugarManager.git',
  user: {
    name: 'Jaime Borges',
    email: 'jeborgesm@hotmail.com'
  }
}, (err) => {
  if (err) {
    console.error('Deployment failed:', err);
  } else {
    console.log('Deployment successful!');
  }
});
