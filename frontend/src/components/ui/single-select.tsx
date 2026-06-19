import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { ChevronsUpDown, X } from "lucide-react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  [key: string]: string | boolean | undefined;
}

interface GroupOption {
  [key: string]: Option[];
}

interface SingleSelectorProps {
  value?: Option;
  defaultOptions?: Option[];
  options?: Option[];
  placeholder?: string;
  loadingIndicator?: React.ReactNode;
  emptyIndicator?: React.ReactNode;
  delay?: number;
  triggerSearchOnFocus?: boolean;
  onSearch?: (value: string) => Promise<Option[]>;
  onSearchSync?: (value: string) => Option[];
  onChange?: (option?: Option) => void;
  disabled?: boolean;
  groupBy?: string;
  className?: string;
  selectFirstItem?: boolean;
  creatable?: boolean;
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    "value" | "placeholder" | "disabled"
  >;
}

export interface SingleSelectorRef {
  selectedValue: Option | undefined;
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}

export const useDebounce = <T,>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const transToGroupOption = (
  options: Option[],
  groupBy?: string,
): GroupOption => {
  if (options.length === 0) {
    return {};
  }

  if (!groupBy) {
    return {
      "": options,
    };
  }

  const groupOption: GroupOption = {};

  options.forEach((option) => {
    const key = (option[groupBy] as string) || "";

    if (!groupOption[key]) {
      groupOption[key] = [];
    }

    groupOption[key].push(option);
  });

  return groupOption;
};

const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) {
    return null;
  }

  return (
    <div
      ref={forwardedRef}
      className={cn("py-6 text-center text-sm", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});

CommandEmpty.displayName = "CommandEmpty";

const SingleSelector = forwardRef<SingleSelectorRef, SingleSelectorProps>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      onSearchSync,
      loadingIndicator,
      emptyIndicator,
      disabled,
      groupBy,
      className,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [onScrollbar, setOnScrollbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [selected, setSelected] = useState<Option | undefined>(value);

    const [options, setOptions] = useState<GroupOption>(
      transToGroupOption(defaultOptions, groupBy),
    );

    const [inputValue, setInputValue] = useState("");
    const [commandValue, setCommandValue] = useState("");
    const [showAllOptions, setShowAllOptions] = useState(true);

    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

    useImperativeHandle(
      ref,
      () => ({
        selectedValue: selected,
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef.current?.focus(),
        reset: () => setSelected(undefined),
      }),
      [selected],
    );

    const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        inputRef.current.blur();
      }
    }, []);

    const handleUnselect = useCallback(() => {
      setSelected(undefined);
      onChange?.(undefined);

      setInputValue("");

      if (arrayOptions) {
        setOptions(transToGroupOption(arrayOptions, groupBy));
      }
    }, [arrayOptions, groupBy, onChange]);

    useEffect(() => {
      if (open && arrayOptions && !inputValue) {
        setOptions(transToGroupOption([...arrayOptions], groupBy));
      }
    }, [open, arrayOptions, groupBy, inputValue]);

    useEffect(() => {
      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchend", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      };
    }, [open, handleClickOutside]);

    useEffect(() => {
      if (value !== undefined) {
        setSelected(value);
      }
    }, [value]);

    useEffect(() => {
      if (!arrayOptions || onSearch) {
        return;
      }

      const newOptions = transToGroupOption(arrayOptions, groupBy);

      if (JSON.stringify(newOptions) !== JSON.stringify(options)) {
        setOptions(newOptions);
      }
    }, [arrayOptions, groupBy, onSearch, options]);

    useEffect(() => {
      const doSearchSync = () => {
        const result = onSearchSync?.(debouncedSearchTerm);

        setOptions(transToGroupOption(result || [], groupBy));
      };

      const execute = async () => {
        if (!onSearchSync || !open) {
          return;
        }

        if (triggerSearchOnFocus) {
          doSearchSync();
        }

        if (debouncedSearchTerm) {
          doSearchSync();
        }
      };

      void execute();
    }, [
      debouncedSearchTerm,
      groupBy,
      onSearchSync,
      open,
      triggerSearchOnFocus,
    ]);

    useEffect(() => {
      const doSearch = async () => {
        setIsLoading(true);

        const result = await onSearch?.(debouncedSearchTerm);

        setOptions(transToGroupOption(result || [], groupBy));

        setIsLoading(false);
      };

      const execute = async () => {
        if (!onSearch || !open) {
          return;
        }

        if (triggerSearchOnFocus) {
          await doSearch();
        }

        if (debouncedSearchTerm) {
          await doSearch();
        }
      };

      void execute();
    }, [debouncedSearchTerm, groupBy, onSearch, open, triggerSearchOnFocus]);

    const CreatableItem = () => {
      if (!creatable) {
        return undefined;
      }

      let exists = false;

      Object.values(options).forEach((optionGroup) => {
        if (
          optionGroup.some(
            (option) =>
              option.value === inputValue || option.label === inputValue,
          )
        ) {
          exists = true;
        }
      });

      if (
        exists ||
        (selected &&
          (selected.value === inputValue || selected.label === inputValue))
      ) {
        return undefined;
      }

      const item = (
        <CommandItem
          value={inputValue}
          className="cursor-pointer"
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onSelect={(value) => {
            const newOption = {
              value,
              label: value,
            };

            setSelected(newOption);
            onChange?.(newOption);

            setInputValue("");
            setOpen(false);
          }}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      );

      if (!onSearch && inputValue.length > 0) {
        return item;
      }

      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
        return item;
      }

      return undefined;
    };

    const EmptyItem = useCallback(() => {
      if (!emptyIndicator) {
        return undefined;
      }

      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value="-" disabled>
            {emptyIndicator}
          </CommandItem>
        );
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    }, [creatable, emptyIndicator, onSearch, options]);

    const commandFilter = useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter;
      }

      if (creatable) {
        return (value: string, search: string) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
        };
      }

      return undefined;
    }, [creatable, commandProps?.filter]);

    return (
      <Command
        ref={dropdownRef}
        {...commandProps}
        value={commandValue}
        className={cn(
          "h-auto overflow-visible bg-transparent",
          commandProps?.className,
        )}
        shouldFilter={false}
        filter={commandFilter()}
      >
        <div
          className={cn(
            "flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            className,
          )}
          onClick={() => {
            if (disabled) {
              return;
            }

            setOpen(true);
            setShowAllOptions(true);
            setInputValue("");

            setCommandValue(Math.random().toString());

            if (arrayOptions) {
              setOptions(transToGroupOption(arrayOptions, groupBy));
            }

            inputRef.current?.focus();

            if (triggerSearchOnFocus) {
              if (onSearch) {
                void onSearch("");
              } else if (onSearchSync) {
                const result = onSearchSync("");
                setOptions(transToGroupOption(result || [], groupBy));
              }
            }
          }}
        >
          {selected ? (
            <div className="flex flex-1 items-center">
              {selected.label}

              {!disabled && (
                <button
                  type="button"
                  className="ml-2"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleUnselect();
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <CommandPrimitive.Input
              {...inputProps}
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={(value) => {
                setInputValue(value);
                setShowAllOptions(value.length === 0);
                inputProps?.onValueChange?.(value);
              }}
              onBlur={(event) => {
                if (!onScrollbar) {
                  setOpen(false);
                }

                inputProps?.onBlur?.(event);
              }}
              onFocus={(event) => {
                setOpen(true);

                if (arrayOptions) {
                  setOptions(transToGroupOption(arrayOptions, groupBy));
                }

                if (triggerSearchOnFocus) {
                  if (onSearch) {
                    void onSearch("");
                  } else if (onSearchSync) {
                    const result = onSearchSync("");
                    setOptions(transToGroupOption(result || [], groupBy));
                  }
                }

                inputProps?.onFocus?.(event);
              }}
              placeholder={placeholder}
              className={cn(
                "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
                inputProps?.className,
              )}
            />
          )}

          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>

        <div className="relative">
          {open && (
            <CommandList
              className="absolute top-1 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
              onMouseLeave={() => setOnScrollbar(false)}
              onMouseEnter={() => setOnScrollbar(true)}
              onMouseUp={() => inputRef.current?.focus()}
            >
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {EmptyItem()}
                  {CreatableItem()}

                  {!selectFirstItem && (
                    <CommandItem value="-" className="hidden" />
                  )}

                  {Object.entries(options).map(([key, dropdowns]) => (
                    <CommandGroup
                      key={key}
                      heading={key}
                      className="h-full overflow-auto"
                    >
                      {dropdowns
                        .filter(
                          (option) =>
                            showAllOptions ||
                            option.label
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()),
                        )
                        .map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.label}
                            disabled={option.disable}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                            }}
                            onSelect={() => {
                              setInputValue("");
                              setSelected(option);
                              onChange?.(option);
                              setOpen(false);
                            }}
                            className={cn(
                              "cursor-pointer",
                              option.disable &&
                                "cursor-default text-muted-foreground",
                            )}
                          >
                            {option.label}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    );
  },
);

SingleSelector.displayName = "SingleSelector";

export { SingleSelector };
