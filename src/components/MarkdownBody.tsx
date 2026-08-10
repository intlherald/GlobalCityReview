import ReactMarkdown from "react-markdown";

export function MarkdownBody({ body }: { body: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={{
          img: ({ src, alt }) => <img src={src} alt={alt || ""} loading="lazy" />,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          )
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
