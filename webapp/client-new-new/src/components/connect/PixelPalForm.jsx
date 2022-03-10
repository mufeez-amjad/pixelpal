import React from 'react';
import axios from 'axios';

export default function PixelPalForm(props) {
  const [ppid, setPPID] = React.useState(props.ppid || "");

  function validatePPID(ppid) {
    return ppid || ""; // todo: improve validation logic
  }

  async function send() {
    const address = await props.signer.getAddress();
    const ppidSafe = validatePPID(ppid);
    const signature = await props.signer.signMessage(ppidSafe);
    console.log({ address, ppidSafe, signature });
    
    axios.post('http://localhost:3001/auth', { ppidSafe, address, signature }); // requires backend server to be running on same host
  }

  function handleFormChange(event) {
    setPPID(event.target.value);
  }

  return (
    <div>
      <div className="flex flex-wrap -mx-3 mb-4">
        <div className="w-full px-3">
          <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="name">PixelPal ID <span className="text-red-600">*</span></label>
          <input onChange={handleFormChange} value={ppid} id="name" type="text" className="form-input w-full text-gray-800" placeholder="ppid_123abc..." required />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mt-6">
        <div className="w-full px-3">
          <button onClick={send} className="btn text-white bg-blue-600 hover:bg-blue-700 w-full">Link PixelPal</button>
        </div>
      </div>
      <div className="text-sm text-gray-500 text-center mt-3">
        By creating an account, you agree to the <a className="underline" href="#0">terms & conditions</a>, and our <a className="underline" href="#0">privacy policy</a>.
      </div>
    </div>
  )
}
