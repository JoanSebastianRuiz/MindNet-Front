import { useRouter } from "next/navigation";
import React from "react";

const HighlightText = ({ text, mentionedUsers = [] }) => {
  const router = useRouter();

  if (typeof text !== "string") return null;

  const mentionedUsernames = new Set(mentionedUsers.map(user => user.username));
  const regex = /(@[\w.-]+|#[\w]+)/g; // Captura menciones (@usuario) y hashtags (#etiqueta)

  let lastIndex = 0;
  const elements = [];
  
  for (const match of text.matchAll(regex)) {
    const { index } = match;
    const matchText = match[0];

    // Agregar el texto normal antes del match
    if (index > lastIndex) {
      elements.push(text.slice(lastIndex, index));
    }

    if (matchText.startsWith("@")) {
      const username = matchText.slice(1);
      const isMentioned = mentionedUsernames.has(username);

      elements.push(
        isMentioned ? (
          <button
            key={index}
            className="text-blue-500 font-semibold"
            onClick={() => router.push(`/profile/${username}`)}
          >
            {matchText}
          </button>
        ) : (
          <span key={index} className="text-gray-500">{matchText}</span>
        )
      );
    } else if (matchText.startsWith("#")) {
      elements.push(
        <span key={index} className="text-green-500 font-semibold">
          {matchText}
        </span>
      );
    }

    lastIndex = index + matchText.length;
  }

  // Agregar el texto restante después del último match
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return <>{elements}</>;
};

export default HighlightText;
