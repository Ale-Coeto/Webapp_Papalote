import { HydrateClient } from "~/trpc/server";
import { GoogleButton } from "./_components/auth/SigninButtons";
import { getProviders } from "next-auth/react";

export default async function Home() {
  const providers = await getProviders();

  return (
    <HydrateClient>
      <div>
        <main className="flex h-screen w-screen flex-row">
          <div
            className="hidden w-1/2 bg-black bg-cover bg-center lg:block"
            style={{ backgroundImage: `url('/Papalote_entrada.png')` }}
          >
          </div>
          <div className="flex w-full flex-row px-10 lg:w-1/2 bg-fondo">
            <div className="mt-10 flex flex-col gap-y-2 lg:mt-32">
              <h1 className="font-fira-sans pb-6 text-2xl font-bold text-gris lg:text-7xl text-center">
                Dashboard de Administrador
              </h1>
              
              <div className="mt-16 flex-col flex h-full items-center justify-center ">
                <h2 className="font-fira-sans mb-8 text-lg font-bold text-gris lg:text-4xl text-center">Iniciar Sesión</h2>
                <GoogleButton className="shadow-lg" providers={providers} />
              </div>
              
              <div className="mb-10 mt-auto">
                <div className="mt-4 flex space-x-4 items-center align-middle flex-row justify-around">
                  <img
                    src="/Papalote.png"
                    alt="Papalote Logo"
                    className="w-[18%] object-contain"
                  />
                
                  <img
                    src="/Tec.png"
                    alt="Tec Logo"
                    className="h-auto w-[15%] object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </HydrateClient>
  );
}
