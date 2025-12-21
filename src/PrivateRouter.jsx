import { Navigate } from "react-router-dom";
import { UserAuth } from "./Authcontex";

function PrivateRouter({children}) {
    const {session} = UserAuth();
    return (
        <>
            {
                session ? <>{children}</> :<Navigate to='/signup'></Navigate>
            }
        </>
    )
}

export default PrivateRouter;