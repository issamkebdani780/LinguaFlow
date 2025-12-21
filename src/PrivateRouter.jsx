import { Navigate } from 'react-router-dom';
import { UserAuth } from './Authcontex';

const PrivateRouter = ({ children }) => {
  const { session } = UserAuth();

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRouter;