interface Props {
  checkSubmitButtonStatus: () => boolean;
  doFunction: () => void;
  setAlias: (alias: string) => void;
  setPassword: (password: string) => void;
  spacingformat?: string;
  bottom?: string;
}

const AuthenticationFields = (props: Props) => {
  const OnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !props.checkSubmitButtonStatus()) {
      props.doFunction();
    }
  };

  return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={OnEnter}
            onChange={(event) => props.setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className={`form-floating ${props.spacingformat || ''}`}>
          <input
            type="password"
            className={`form-control ${props.bottom || ""}`}
            id="passwordInput"
            placeholder="Password"
            onKeyDown={OnEnter}
            onChange={(event) => props.setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
    );
}

export default AuthenticationFields;