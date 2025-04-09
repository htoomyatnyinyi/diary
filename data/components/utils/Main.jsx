import MainLayout from "./MainLayout";
// import Button from "./Button";
import Navigation from "../Navigation";

const Main = () => {
  return (
    <MainLayout
      // header={<Navigation />}
      sidebar={
        <div className="p-2 m-2">
          {/* <Button onClick={() => console.log("Clicked!")}>Menu Item 1</Button> */}
          {/* <Button variant="secondary">Menu Item 2</Button> */}
        </div>
      }
      content={<ContentPage />}
      footer={<Footer />}
    />
  );
};

export default Main;

const ContentPage = () => {
  return (
    <div className="h-screen bg-green-400 ">
      <h2>Welcome to the Main Page</h2>
      <p>This is the main content area.</p>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="h-screen">
      <p>&copy; 2023 My Application</p>
    </footer>
  );
};
// MainLayout.jsx - A page layout component
// const MainLayout = ({ header, sidebar, content, footer }) => {
//   return (
