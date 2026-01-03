export default function Skeleton({ width = '100%', height = '1rem', borderRadius = '4px', style = {} }) {
    return (
        <div
            className="skeleton"
            style={{
                width,
                height,
                borderRadius,
                ...style
            }}
        />
    );
}

// Add styles to a style tag or component
// We will add the CSS in the global index.css or here
// For simplicity in this project structure, we assume styles in index.css
