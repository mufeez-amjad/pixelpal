import { Signer } from "@ethersproject/abstract-signer";
import React from "react";
import axios from "axios";

export default function PixelPalForm(props: { signer: Signer, id?: string }) {

  const [ppid, setPPID] = React.useState(props.id);

  function validatePPID(id: string | undefined) {
    return id || ""; // todo: improve validation logic
  }

  function handleFormChange(event: any) {
    setPPID(event.target.value);
  }

  async function send() {
    const address = await props.signer.getAddress();
    const ppidSafe = validatePPID(ppid);
    const signature = await props.signer.signMessage(ppidSafe);
    console.log({ address, ppidSafe, signature });
    
    axios.post('http://localhost:3001/auth', { ppidSafe, address, signature }); // requires backend server to be running on same host
  }

  return (
    <div>
        <input type='text' placeholder='pixelpal id' onChange={handleFormChange}></input>
        <button onClick={send}> Submit </button>
    </div>
  )
}
