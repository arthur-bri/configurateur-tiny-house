import styled from "styled-components";

const LoaderWrapper = styled.div`
.spinner {
  width: 40px;
  height: 40px;

  position: relative;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: white;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

@-webkit-keyframes sk-bounce {
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bounce {
  0%, 100% {
    transform: scale(0.0);
  -webkit-transform: scale(0.0);
} 50% {
    transform: scale(1.0);
  -webkit-transform: scale(1.0);
}
}
  `

export const Loader: React.FC = () => {
  return <LoaderWrapper>
    <div className="spinner">
      <div className="double-bounce1"/>
      <div className="double-bounce2"/>
    </div>
  </LoaderWrapper>
}
