import { useNavigate } from "react-router-dom";

const PersonCard = ({ person }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/person/${person._id}`);
  };

  const imageUrl = person.photo
    ? `http://localhost:5000/${person.photo}`
    : "https://via.placeholder.com/300";

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition duration-300"
    >
      {/* Image */}
      <div className="h-56 bg-gray-200">
        <img
          src={imageUrl}
          alt={person.personName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          {person.personName}
        </h2>

        <p className="text-sm text-gray-600">
          <span className="font-medium">Age:</span> {person.age}
        </p>

        <p className="text-sm text-gray-600">
          <span className="font-medium">Last Seen:</span>{" "}
          {person.lastSeenLocation}
        </p>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {person.description}
        </p>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-red-600 font-bold text-sm">
            🚨 Missing
          </span>

          <span className="text-xs text-gray-400">
            {new Date(person.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;