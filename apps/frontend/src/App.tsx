import FormLogin from "./components/LoginForm";

import Header from "./components/Header";
import { useAuth } from "./hooks/useAuth";
import ListProjects from "./components/ListProjects";


function App() {
  const { user } = useAuth();

  return (
    <div className="h-screen w-full">
      {!user ?
        (
          <FormLogin />
        ) : (
          <>
            <Header user={user} />
            {/* 
              <ListProjects />
              <MenuSidebar />
              <Footer />
            */}
          </>
        )
      }

    </div>
  )
}

export default App
