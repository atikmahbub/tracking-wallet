import { useAuth0 } from "@auth0/auth0-react";
import { UserModel } from "@shared/models/User";
import { makeUnixTimestampString, URLString, UserId } from "@shared/primitives";
import React, { SetStateAction, useContext, useState } from "react";

interface NewUserModel extends UserModel {
  default: boolean;
}

interface IProviderValues {
  user: NewUserModel;
  setUser: React.Dispatch<SetStateAction<NewUserModel>>;
  getAccessTokenAndAddUser: () => void;
}

interface IStoreProps {
  children: React.ReactNode;
}

const StoreContext = React.createContext<IProviderValues>(undefined!);

const defaultUser: NewUserModel = {
  name: "Admin",
  email: "admin@gmail.com",
  userId: "admin" as UserId,
  profilePicture: "link" as URLString,
  created: makeUnixTimestampString(Number(new Date())),
  updated: makeUnixTimestampString(Number(new Date())),
  default: true,
};

const StoreProvider: React.FC<IStoreProps> = ({ children }) => {
  const [user, setUser] = useState<NewUserModel>(defaultUser);
  const { getAccessTokenSilently } = useAuth0();

  const getAccessTokenAndAddUser = async () => {
    const token = await getAccessTokenSilently();
    try {
    } catch (error) {
      console.log("error in getting token", error);
    }
  };

  const initialValues: IProviderValues = {
    user,
    setUser,
    getAccessTokenAndAddUser,
  };

  return (
    <StoreContext.Provider value={initialValues}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;

export const useStoreContext = () => useContext(StoreContext);
