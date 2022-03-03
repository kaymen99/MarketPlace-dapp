import { useEffect, useRef } from "react";
import Jazzicon from "@metamask/jazzicon";
import { useSelector } from "react-redux"
import styled from "@emotion/styled";

const StyledIdenticon = styled.div`
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 1rem;
  background-color: black;
`;

export default function Identicon() {
    const ref = useRef();
    const data = useSelector((state) => state.blockchain.value)

    useEffect(() => {
        if (data.account && ref.current) {
            ref.current.innerHTML = "";
            ref.current.appendChild(Jazzicon(28, parseInt(data.account.slice(2, 10), 16)));
        }
    }, [data.account]);

    return <StyledIdenticon style={{ marginLeft: '10px' }} ref={ref} />;
}
