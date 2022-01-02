import Toast from './Toast';

const endpoint = '';
export default () => {
  return new Promise((resolve, _) => {
    fetch(endpoint, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then(resp => resp.json())
      .then(data => resolve(data))
      .catch(err => {
        Toast('Error while loading colors. ' + err.message);
      });
  });
};
