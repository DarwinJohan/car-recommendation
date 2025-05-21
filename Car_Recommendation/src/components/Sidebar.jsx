import React from 'react';
import './Sidebar.css';

import {
    FaHome, FaPlusSquare, FaLayerGroup, FaTrashAlt, FaShoppingBag,
    FaUsers, FaGlobeAmericas, FaChartBar, FaCog, FaQuestionCircle, FaSignOutAlt, FaAngleRight
} from 'react-icons/fa';

const SidebarItem = ({ icon, label, isActive, hasSubmenu, isCollapsed }) => (
    <a href="#" className={`sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-item-icon">{icon}</div>
        {!isCollapsed && <span className="sidebar-item-label">{label}</span>}
        {!isCollapsed && hasSubmenu && <FaAngleRight className="submenu-arrow" />}
    </a>
);

const Sidebar = ({ isCollapsed }) => {
    const menuItems = [
        { icon: <FaHome />, label: 'Home', isActive: true, hasSubmenu: false },
        { icon: <FaPlusSquare />, label: 'Product', hasSubmenu: true },
        { icon: <FaLayerGroup />, label: 'Category', hasSubmenu: true },
        { icon: <FaUsers />, label: 'Users', hasSubmenu: true },
        { icon: <FaChartBar />, label: 'Report' }, 
        { icon: <FaCog />, label: 'Setting' },
    ];

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            
            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        isActive={item.isActive}
                        hasSubmenu={item.hasSubmenu}
                        isCollapsed={isCollapsed}
                    />
                ))}
            </nav>
            <div className="sidebar-footer">
                <SidebarItem icon={<FaSignOutAlt />} label="Log Out" isCollapsed={isCollapsed} />
            </div>
        </div>
    );
};

export default Sidebar;