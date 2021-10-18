import React from 'react';
import {RecoilRoot} from 'recoil';
import {withRecoil} from './src/hooks';
import Navigation from './src/navigations';

// export default () => {
//   return (
//     <RecoilRoot>
//       <Navigation />
//     </RecoilRoot>
//   );
// };
export default withRecoil(Navigation);