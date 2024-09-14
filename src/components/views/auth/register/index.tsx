import ButtonElement from "@/components/element/Button";
import InputAuthFragment from "@/components/fragments/InputAuth";
import { Fragment } from "react";

const RegisterView = () => {
  return (
    <Fragment>
      <form>
        <InputAuthFragment
          type="text"
          placeholder=""
          name="username"
          id="username"
          field={{}}
          label={true}
          error=""
        />
        <InputAuthFragment
          type="email"
          placeholder=""
          name="email"
          id="email"
          field={{}}
          error={""}
          label={true}
        />
        <InputAuthFragment
          type="password"
          placeholder=""
          name="password"
          id="password"
          field={{}}
          error={""}
          label={true}
        />
        <ButtonElement type="submit" title="Daftar" />
      </form>
    </Fragment>
  );
};

export default RegisterView;
