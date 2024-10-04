import { useAuth0 } from "@auth0/auth0-react";
import { UserModel } from "@shared/models/User";
import { IAddUserParams } from "@shared/params";
import { makeUnixTimestampString, URLString, UserId } from "@shared/primitives";
import { ApiGateway } from "@trackingPortal/api/implementations";
import { IApiGateWay } from "@trackingPortal/api/interfaces";
import React, { SetStateAction, useContext, useEffect, useState } from "react";

interface NewUserModel extends UserModel {
  default: boolean;
}

interface IProviderValues {
  user: NewUserModel;
  setUser: React.Dispatch<SetStateAction<NewUserModel>>;
  getAccessToken: () => void;
  apiGateway: IApiGateWay;
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

const apiGateway = new ApiGateway();

const StoreProvider: React.FC<IStoreProps> = ({ children }) => {
  const [user, setUser] = useState<NewUserModel>(defaultUser);
  const { getAccessTokenSilently, user: auth0User } = useAuth0();
  const [hasToken, setHasToken] = useState<boolean>(false);

  const addUserToDb = async () => {
    try {
      if (
        !auth0User?.name ||
        !auth0User?.email ||
        !auth0User.picture ||
        !auth0User.sub
      )
        return;
      const params: IAddUserParams = {
        userId: UserId(auth0User.sub),
        name: auth0User.name,
        profilePicture: URLString(auth0User.picture),
        email: auth0User.email,
      };
      const user = await apiGateway.userService.addUser(params);
      setUser({
        ...user,
        default: false,
      });
    } catch (error) {
      console.log("23");
    }
  };

  useEffect(() => {
    hasToken && addUserToDb();
  }, [auth0User, hasToken]);

  const getAccessToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      apiGateway.ajaxUtils.setAccessToken(token);
      setHasToken(true);
    } catch (error) {
      console.log("error in getting token", error);
    }
  };

  const initialValues: IProviderValues = {
    user,
    setUser,
    getAccessToken,
    apiGateway,
  };

  return (
    <StoreContext.Provider value={initialValues}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;

export const useStoreContext = () => useContext(StoreContext);
