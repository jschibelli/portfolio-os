import PostAuthorInfo from './post-author-info';
import { useAppContext } from '../../contexts/appContext';
import { PostFullFragment } from '../../../generated/graphql';

function AboutAuthor() {
  const { post: _post } = useAppContext();
  const post = _post as unknown as PostFullFragment;
  const { publication, author } = post;
  let coAuthors = post.coAuthors || [];

  const allAuthors = publication?.isTeam ? [author, ...coAuthors] : [author];

  return (
    <div className="mx-auto w-full px-5 md:max-w-screen-md mb-5 mt-10">
      <div className="flex-1">
        <div className="flex flex-col items-start">
          <h3 className="mb-6 w-full text-lg font-semibold text-foreground border-b border-border pb-2">
            Written by
          </h3>
          <div className="flex w-full flex-col gap-8">
            {allAuthors.map((_author) => {
              return (
                <PostAuthorInfo
                  key={_author.id.toString()}
                  author={_author}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutAuthor;