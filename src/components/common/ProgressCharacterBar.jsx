const ProgressCharacterBar = ({ characters, maxLength }) => {
    // Cambia el color del contador según la cantidad de caracteres usados
    const getCharacterColor = () => {
        if (characters >= maxLength) return "text-red-500";
        if (characters > maxLength * 0.7) return "text-yellow-500";
        return "text-gray-500";
    };
    return(
        <div className="flex justify-between items-center mt-1 text-sm">
          <span className={`${getCharacterColor()} font-medium`}>
            {characters}/{maxLength}
          </span>
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden ml-3">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(characters / maxLength) * 100}%` }}
            ></div>
          </div>
        </div>
    );
};

export default ProgressCharacterBar;