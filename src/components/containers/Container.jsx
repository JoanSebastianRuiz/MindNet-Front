import NavBar from "@/components/navs/NavBar";
import ContainerBody from "./ContainerBody";

const Container = ({ children }) => {
    return (
        <main className="relative grid grid-cols-1 md:grid-cols-6 gap-4 p-4 md:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <NavBar />
            <ContainerBody>
                {children}
            </ContainerBody>
        </main>
    );
};

export default Container;
