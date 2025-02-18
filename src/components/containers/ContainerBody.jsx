import NotificationComponent from "../common/NotificationComponent";

const ContainerBody = ({ children }) => {
    return (
        <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-xl transition-all duration-300 md:col-span-5 flex flex-col overflow-auto">
            {/* Contenedor de notificaciones */}
            <NotificationComponent />

            {children}
        </section>
    );
}

export default ContainerBody;
