import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./NotificationButton.css"

function NotificationButton({hasNotifications,setHasNotifications,onClick}) {
    

    return ( <>
    <button className="NotificationButton"
            onClick={onClick}
    >
        <FontAwesomeIcon icon={faBell}/>
        {hasNotifications && (
        <span class="ReddotNoti"></span>
    )}
    </button>
    
    </> );
}

export default NotificationButton;