// MainLayout.jsx - A page layout component
const MainLayout = ({ header, sidebar, content, footer }) => {
  return (
    <div className="main-layout">
      <header className="layout-header">{header}</header>
      <div className="layout-body">
        <aside className="layout-sidebar">{sidebar}</aside>
        <main className="layout-content">{content}</main>
      </div>
      <footer className="layout-footer">{footer}</footer>
    </div>
  );
};

export default MainLayout;
