import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./SupabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Sign up
  const signUp = async (email, userName, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          userName,
        },
      },
    });

    if (error) console.error("Error signing up:", error);

    return { data, error };
  };

  // Sign in
  const signin = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) console.error("Error signing in:", error);

      return { data, error };
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  // Session handling
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error);
  };

  return (
    <AuthContext.Provider value={{ session, signUp, signin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);