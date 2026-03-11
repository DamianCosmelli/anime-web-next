interface TitlePageProps {
    title: string;
}

export const TitlePage = ({ title }: TitlePageProps) => {
    return (
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {title}
        </h1>
    );
};
