import { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { getPeople } from '../../api';
import { Person } from '../../types';
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';

export const Tablet = () => {
  const [people, setPeople] = useState<Person[]>();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoader, setIsLoader] = useState<boolean>(false);

  const [checkedIndex, setCheckedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoader(true);
    getPeople()
      .then(res => setPeople(res))
      .catch(() => setIsError(true))
      .finally(() => setIsLoader(false));
  }, []);

  const { slug } = useParams();

  useEffect(() => {
    if (people && slug) {
      const index = people.findIndex(p => p.slug === slug);

      setCheckedIndex(index);
    }
  }, [people, slug]);

  return (
    <div className="block">
      <div className="box table-container">
        {isLoader && <Loader />}

        {isError && (
          <p data-cy="peopleLoadingError" className="has-text-danger">
            Something went wrong
          </p>
        )}

        {people?.length === 0 && (
          <p data-cy="noPeopleMessage">There are no people on the server</p>
        )}

        {people && people.length > 0 && (
          <table
            data-cy="peopleTable"
            className="table is-striped is-hoverable is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Sex</th>
                <th>Born</th>
                <th>Died</th>
                <th>Mother</th>
                <th>Father</th>
              </tr>
            </thead>

            <tbody>
              {people?.map((person: Person, index: number) => {
                const motherInList = people.find(
                  per => per.name === person.motherName,
                );
                const fatherInList = people.find(
                  per => per.name === person.fatherName,
                );

                return (
                  <tr
                    data-cy="person"
                    key={index}
                    className={classNames({
                      'has-background-warning': index === checkedIndex,
                    })}
                  >
                    <td>
                      <a
                        className={classNames({
                          'has-text-danger': person.sex === 'f',
                        })}
                        href={`#/people/${person.slug}`}
                        onClick={e => {
                          e.preventDefault();
                          navigate(`/people/${person.slug}`, { replace: true });
                          setCheckedIndex(index);
                        }}
                      >
                        {person.name}
                      </a>
                    </td>

                    <td>{person.sex}</td>
                    <td>{person.born}</td>
                    <td>{person.died}</td>
                    <td>
                      {motherInList ? (
                        <a
                          className={classNames({
                            'has-text-danger': motherInList,
                          })}
                          onClick={e => {
                            e.preventDefault();
                            setCheckedIndex(
                              people.findIndex(
                                p => p.name === person.motherName,
                              ),
                            );
                            navigate(`/people/${motherInList.slug}`, {
                              replace: true,
                            });
                          }}
                          href={`#/people/${motherInList?.slug}`}
                        >
                          {person.motherName !== null &&
                          person.motherName !== undefined
                            ? person.motherName
                            : '-'}
                        </a>
                      ) : (
                        <span>
                          {person.motherName ? person.motherName : '-'}
                        </span>
                      )}
                    </td>

                    <td>
                      {fatherInList ? (
                        <a
                          onClick={e => {
                            e.preventDefault();
                            setCheckedIndex(
                              people.findIndex(
                                p => p.name === person.fatherName,
                              ),
                            );
                            navigate(`/people/${fatherInList.slug}`, {
                              replace: true,
                            });
                          }}
                          href={`#/people/${fatherInList?.slug}`}
                        >
                          {person.fatherName !== null &&
                          person.fatherName !== undefined
                            ? person.fatherName
                            : '-'}
                        </a>
                      ) : (
                        <span>
                          {person.fatherName ? person.fatherName : '-'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* <tr data-cy="person">
              <td>
                <a href="#/people/philibert-haverbeke-1907">
                  Philibert Haverbeke
                </a>
              </td>

              <td>m</td>
              <td>1907</td>
              <td>1997</td>

              <td>
                <a
                  className="has-text-danger"
                  href="#/people/emma-de-milliano-1876"
                >
                  Emma de Milliano
                </a>
              </td>

              <td>
                <a href="#/people/emile-haverbeke-1877">Emile Haverbeke</a>
              </td>
            </tr>

            <tr data-cy="person" className="has-background-warning">
              <td>
                <a href="#/people/jan-frans-van-brussel-1761">
                  Jan Frans van Brussel
                </a>
              </td>

              <td>m</td>
              <td>1761</td>
              <td>1833</td>
              <td>-</td>

              <td>
                <a href="#/people/jacobus-bernardus-van-brussel-1736">
                  Jacobus Bernardus van Brussel
                </a>
              </td>
            </tr>

            <tr data-cy="person">
              <td>
                <a
                  className="has-text-danger"
                  href="#/people/lievijne-jans-1542"
                >
                  Lievijne Jans
                </a>
              </td>

              <td>f</td>
              <td>1542</td>
              <td>1582</td>
              <td>-</td>
              <td>-</td>
            </tr>

            <tr data-cy="person">
              <td>
                <a href="#/people/bernardus-de-causmaecker-1721">
                  Bernardus de Causmaecker
                </a>
              </td>

              <td>m</td>
              <td>1721</td>
              <td>1789</td>

              <td>
                <a
                  className="has-text-danger"
                  href="#/people/livina-haverbeke-1692"
                >
                  Livina Haverbeke
                </a>
              </td>

              <td>
                <a href="#/people/lieven-de-causmaecker-1696">
                  Lieven de Causmaecker
                </a>
              </td>
            </tr> */}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
